<?php
include_once(WWAC_PLUGIN_DIR_PATH."core/classes/class.WWACCustomArchives.php");
get_header();

if(!wp_style_is('font-awesome', 'registered')){
    wp_enqueue_style('wwac-font-awesome');
}

$WWACCustomArchives = new WWACCustomArchives();
$agent = get_queried_object();
$agentID = $agent->term_id;

// HERO IMAGE – z templatu
$heroImageURL = $WWACCustomArchives->getTemplateAssetURL('agent', 'img/agent-hero.jpg');
?>

<style>
/* HERO */
.wwac-hero {
    width: 100%;
    height: 45vh;
    background-image: url('<?php echo esc_url($heroImageURL); ?>');
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.wwac-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
}
.wwac-hero h1 {
    position: relative;
    color: #fff;
    font-size: 42px;
    margin: 0;
}

/* --- LAYOUT --- */
.wwac-agent-archive-wrapper{
    max-width: 1140px;
    margin: 40px auto;
    display: flex;
    gap: 40px;
}

/* LEFT: offers */
.wwac-agent-archive-left{
    width: 70%;
}

/* RIGHT: agent panel */
.wwac-agent-archive-right{
    width: 30%;
    position: sticky;
    top: 20px;
    height: fit-content;
}

/* Agent panel */
.wwac-agent-panel{
    background: #efefef;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
}
.wwac-agent-panel img{
    border-radius: 12px;
    margin-bottom: 15px;
}
.wwac-agent-panel h2{
    margin-bottom: 10px;
}

.wwac-agent-panel ul{
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: left !important;
}
.wwac-agent-panel ul li{
    margin: 6px 0;
}
.wwac-agent-panel ul li i{
    margin-right: 4px;
    color: #70b38c;
}

/* OFFER CARD */
.wwac-agent-offer-card{
    display: flex;
    gap: 20px;
    padding: 15px;
    background: #efefef;
    border-radius: 12px;
    margin-bottom: 25px;
    align-items: stretch;
}

.wwac-offer-thumb-wrapper{
    width: 190px;
    height: 160px;
    overflow: hidden;
    flex-shrink: 0;
}
.wwac-offer-thumb-wrapper img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Offer info */
.wwac-offer-content{
    flex: 1;
}
.wwac-offer-title{
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
    text-decoration: none;
    color: #000;
}

/* META INLINE */
.wwac-offer-meta-inline{
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 14px;
    margin-bottom: 12px;
}
.wwac-offer-meta-inline span{
    display: flex;
    align-items: center;
    gap: 4px;
}
.wwac-offer-meta-inline span i{
    color: #70b38c;
}

/* Excerpt */
.wwac-offer-excerpt{
    font-size: 15px;
    line-height: 1.5;
    overflow-wrap: break-word;
    word-break: break-word;
}

/* PAGINATION */
.wwac-pagination{
    text-align: center;
    margin: 40px 0;
}
.wwac-pagination a,
.wwac-pagination span{
    display: inline-block;
    padding: 8px 14px;
    margin: 0 3px;
    border-radius: 6px;
    background: #efefef;
    color: #333;
    text-decoration: none;
    font-size: 15px;
}
.wwac-pagination .current{
    background: #70b38c;
    color: #fff;
    font-weight: bold;
}
.wwac-pagination a:hover{
    background: #d8d8d8;
}

@media(max-width: 1024px){
    .wwac-agent-archive-wrapper{
        flex-direction: column;
    }
    .wwac-agent-archive-left,
    .wwac-agent-archive-right{
        width: 100%;
    }
}

/* --- MOBILE FIXES --- */
@media(max-width: 768px){

    /* wyłącz sticky sidebar */
    .wwac-agent-archive-right{
        position: relative;
        top: 0;
        width: 100%;
        margin-bottom: 30px;
    }

    /* wrapper w jednej kolumnie */
    .wwac-agent-archive-wrapper{
        flex-direction: column;
        gap: 20px;
    }

    /* karty ofert w układzie pionowym */
    .wwac-agent-offer-card{
        flex-direction: column;
        align-items: flex-start;
    }

    /* miniatura 100% szerokości */
    .wwac-offer-thumb-wrapper{
        width: 100%;
        height: auto;
    }

    .wwac-offer-thumb-wrapper img{
        width: 100%;
        height: auto;
        object-fit: cover;
    }

    /* meta inline bardziej kompaktowe */
    .wwac-offer-meta-inline{
        flex-direction: column;
        gap: 6px;
    }
}

</style>

<!-- HERO -->
<div class="wwac-hero">
    <h1><?php echo esc_html($agent->name); ?></h1>
</div>

<div class="wwac-agent-archive-wrapper">

    <!-- RIGHT SIDEBAR — AGENT PANEL -->
    <aside class="wwac-agent-archive-right">
        <div class="wwac-agent-panel">

            <?php echo $WWACCustomArchives->showAgentPhoto(); ?>

            <h2><?php echo $WWACCustomArchives->showAgentNames(); ?></h2>

            <ul>
                <li><?php echo $WWACCustomArchives->showAgentPhoneNumbers('<i class="fas fa-phone-alt"></i> <a href="tel:{agent.phones}"><b>{agent.phones}</b></a>'); ?></li>
                <li><?php echo $WWACCustomArchives->showAgentEmailAddress('<i class="fas fa-at"></i> <b>{agent.email}</b>'); ?></li>
                <li><?php echo $WWACCustomArchives->showAgentLicenseNr('<i class="fas fa-id-badge"></i> <b>{agent.licensenr}</b>'); ?></li>
            </ul>

        </div>
    </aside>

    <!-- LEFT COLUMN — LIST OF OFFERS -->
    <section class="wwac-agent-archive-left">

        <?php
        $paged = get_query_var('paged') ? get_query_var('paged') : 1;

        $offers = new WP_Query([
            'post_type' => 'nieruchomosci',
            'tax_query' => [
                [
                    'taxonomy' => 'Agent',
                    'field'    => 'term_id',
                    'terms'    => $agentID
                ]
            ],
            'posts_per_page' => 10,
            'paged' => $paged
        ]);

        if($offers->have_posts()):
            while($offers->have_posts()):
                $offers->the_post();

                $thumb = get_the_post_thumbnail_url(get_the_ID(), 'medium_large');
                if(!$thumb){
                    $thumb = WWAC_PLUGIN_DIR_URL.'assets/img/offer-placeholder.jpg';
                }

                // CLEAN EXCERPT
                $clean = strip_shortcodes(get_the_content());
                $clean = wp_strip_all_tags($clean);
                $clean = html_entity_decode($clean);
                $clean = preg_replace('/\s+/u', ' ', $clean);
                $clean = trim($clean);
                $excerpt = wp_trim_words($clean, 18, '…');
                ?>

                <article class="wwac-agent-offer-card">

                    <!-- IMAGE -->
                    <div class="wwac-offer-thumb-wrapper">
                        <a href="<?php the_permalink(); ?>">
                            <img src="<?php echo esc_url($thumb); ?>" alt="">
                        </a>
                    </div>

                    <!-- CONTENT -->
                    <div class="wwac-offer-content">

                        <a href="<?php the_permalink(); ?>" class="wwac-offer-title">
                            <?php the_title(); ?>
                        </a>

                        <div class="wwac-offer-meta-inline">

                            <span><i class="fas fa-money-bill"></i>
                                <?php echo $WWACCustomArchives->showPropertyMeta('{meta}', 'propertyPrice'); ?>
                            </span>

                            <span><i class="fas fa-map-marker-alt"></i>
                                <?php echo $WWACCustomArchives->showPropertyTax('{taxonomy}', 'Localization'); ?>
                            </span>

                            <span><i class="fas fa-tags"></i>
                                <?php echo $WWACCustomArchives->showPropertyTax('{taxonomy}', 'Category'); ?>
                            </span>

                            <span><i class="fas fa-home"></i>
                                <?php echo $WWACCustomArchives->showPropertyTax('{taxonomy}', 'Type'); ?>
                            </span>

                        </div>

                        <div class="wwac-offer-excerpt">
                            <?php echo esc_html($excerpt); ?>
                        </div>

                    </div>

                </article>

                <?php
            endwhile;

            // PAGINATION
            echo '<div class="wwac-pagination">';
            echo paginate_links([
                'total' => $offers->max_num_pages,
                'current' => $paged,
                'mid_size' => 2,
                'prev_text' => '&laquo; Poprzednia',
                'next_text' => 'Następna &raquo;',
            ]);
            echo '</div>';

            wp_reset_postdata();

        else:
            echo "<p>Brak ofert przypisanych do tego agenta.</p>";
        endif;
        ?>

    </section>
</div>

<?php get_footer(); ?>
